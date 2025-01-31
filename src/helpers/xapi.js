// list of H5P activities links (react routes) where xAPI dispatch need to initialized
export function allowedH5PActvityPaths() {
  return [
    '/gclass/launch/:userId/:courseId/:activityId/:classworkId',
    '/lti-tools/activity/:activityId',
  ];
}

// map H5P activities links (react routes) to supported Platforms
export function H5PActvityPathMapToPlatform() {
  return [
    { '/project/:projectId/playlist/:playlistId/activity/:activityId/preview': 'CurrikiStudio' },
    { '/activity/:activityId/shared': 'CurrikiStudio' },
    { '/gclass/launch/:userId/:courseId/:activityId/:classworkId': 'Google Classroom' },
    { '/lti-tools/activity/:activityId': 'LTI client' },
  ];
}

// check if xAPI need to initialized for H5P Activity link (react route)
export function isxAPINeeded(currentRoute) {
  return allowedH5PActvityPaths().includes(currentRoute);
}

export function extendStatement(h5pObj, statement, params, skipped = false) {
  const {
    path,
    activityId,
    submissionId,
    attemptId,
    studentId,
    courseId, // LMS course id
    homepage,
    toolPlatform,
    activeCourse,
  } = params;

  const platform = H5PActvityPathMapToPlatform().find((el) => el[path]);
  if (platform === undefined) return;

  const statementExtended = { ...statement };
  const other = [
    {
      objectType: 'Activity',
      id: `${window.location.origin}/activity/${activityId}/submission/${submissionId}/${attemptId}`,
    },
    {
      objectType: 'Activity',
      id: `${window.location.origin}/activity/${activityId}/submission/${submissionId}`,
    },
  ];

  if (platform[path] === 'Google Classroom') {
    other.push({
      objectType: 'Activity',
      id: `${window.location.origin}/gclass/${courseId}`,
    });

    if (statementExtended.object && statementExtended.object.definition && statementExtended.object.definition.extensions) {
      statementExtended.object.definition.extensions['http://currikistudio.org/x-api/gclass-alternate-course-id'] = activeCourse.alternateLink;
      statementExtended.object.definition.extensions['http://currikistudio.org/x-api/course-name'] = activeCourse.name;
    }
  }

  if (platform[path] === 'LTI client') {
    other.push({
      objectType: 'Activity',
      id: `${window.location.origin}/lti/${courseId}`,
    });
  }

  const actor = {
    objectType: 'Agent',
    account: {
      homePage: homepage || 'https://classroom.google.com',
      name: studentId,
    },
  };

  if (statementExtended.context) {
    if (platform[path] === 'LTI client') {
      statementExtended.context.platform = toolPlatform;
    } else {
      statementExtended.context.platform = platform[path];
    }

    statementExtended.context.contextActivities.other = other;
  }

  statementExtended.actor = actor;

  // If the statement is marked as skipped, we supply the proper verb
  if (skipped) {
    statementExtended.verb = {
      id: 'http://adlnet.gov/expapi/verbs/skipped',
      display: {
        'en-US': 'skipped',
      },
    };

    // Some skipped statements come with score.min = 0 and score.max = 0
    // This causes an error in the backend
    if (
      statementExtended.result
      && statementExtended.result.score
      && statementExtended.result.score.min === statementExtended.result.score.max
    ) {
      statementExtended.result.score.max += 1;
    }
  }

  // Some H5Ps provide incompatible interaction types. Mapping those to valid ones here
  if (statementExtended.object && statementExtended.object.definition.interactionType === 'compound') {
    statementExtended.object.definition.interactionType = 'choice';
  }

  // We need page information for InteractiveBook statements but the children objects are agnostic to where
  // they're being used.
  // Here we crawl up through their heritage to see if they belong to an InteractiveBook, if they do, we
  // add the page info to the statement.
  let interactiveBookObject = h5pObj;

  while (interactiveBookObject && interactiveBookObject?.libraryInfo?.machineName !== 'H5P.InteractiveBook') {
    interactiveBookObject = interactiveBookObject.parent;
  }

  if (interactiveBookObject?.libraryInfo?.machineName === 'H5P.InteractiveBook') {
    const chapterIndex = interactiveBookObject.getActiveChapter();
    statementExtended.object.definition.extensions['http://currikistudio.org/x-api/h5p-chapter-name'] = interactiveBookObject.chapters[chapterIndex].title;
  }

  return statementExtended;
}
